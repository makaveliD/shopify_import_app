<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckboxGetReceiptRequest;
use App\Http\Requests\CheckboxReceiptRequest;
use App\Http\Requests\CheckboxServiceReceipt;
use App\Library\Checkbox;
use App\Order;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CheckboxController extends Controller
{
    protected $user;
    protected $checkbox;
    private $error = array();
    private $json = array();

    public function __construct(Checkbox $checkbox)
    {
        $this->checkbox = $checkbox;
    }

    public function createReceipt(CheckboxReceiptRequest $request)
    {
        $order_id = $request->input('order_id');

        $payment_type = 'CASH';
        $send_email = true;

        if ($request->input('is_return')) {
            $is_return = true;
        } else {
            $is_return = false;
        }
        $order_info = $this->checkbox->getOrder($order_id);

        $email = $order_info->contact_email;
        if (isset($order_info->customer)) {
            $cashier_name = $order_info->customer->first_name.' '.$order_info->customer->last_name;
        } else {
            $cashier_name = $order_info->contact_email;
        }
        $departament = 'store';


        $params = [];

        $goods = [];

        $products = $order_info->line_items;
        $total = 0;

        foreach ($products as $product) {
            $price = (float) number_format((float) $product->price, 2, '', '');

            $good = [
                'code' => $product->id.'-'.$product->name,
                'name' => $product->name,
                'price' => $price
            ];

            $total += $price;

            $item = [
                'good' => $good,
                'quantity' => (int) $product->quantity * 1000
            ];

            if ($is_return) {
                $item['is_return'] = true;
            }

            $goods[] = $item;
        }

        $params['goods'] = $goods;
        $params['cashier_name'] = $cashier_name;
        $params['departament'] = $departament;

        if ($send_email) {
            $params['delivery'] = ['email' => $email];
        }

        foreach ($order_info->discount_codes as $discount_code) {
            $discount_type = 'DISCOUNT';


//            if ($order_total['value'] > 0) {
//                $discount_type = 'EXTRA_CHARGE';
//            } else {
//                $discount_type = 'DISCOUNT';
//            }

            $discount_price = (float) number_format((float) $discount_code->amount, 2, '', '');

            $params['discounts'][] = array(
                'type' => $discount_type,
                'mode' => 'VALUE',
                'value' => abs($discount_price),
                'name' => $discount_code->code,
            );
        }
        if (!$order_info->taxes_included) {
            $discount_type = 'EXTRA_CHARGE';
            $discount_price = (float) number_format((float) $order_info->total_tax, 2, '', '');

            $params['discounts'][] = array(
                'type' => $discount_type,
                'mode' => 'VALUE',
                'value' => abs($discount_price),
                'name' => 'Taxes',
            );
        }

        if ($order_info->total_shipping_price_set->shop_money->amount != 0) {
            $discount_type = 'EXTRA_CHARGE';
            $discount_price = (float) number_format((float) $order_info->total_shipping_price_set->shop_money->amount,
                2,
                '', '');

            $params['discounts'][] = array(
                'type' => $discount_type,
                'mode' => 'VALUE',
                'value' => abs($discount_price),
                'name' => 'Shipping',
            );
        }
        $params['payments'][] = [
            'type' => (in_array($payment_type, ['CASH', 'CASHLESS', 'CARD'])) ? $payment_type : 'CASH',
            'value' => (float) number_format((float) $order_info->total_price, 2, '', '')
        ];

        $receipt = $this->checkbox->create_receipt($params);
        $this->json['return_$params'] = $params;
        $this->json['return_receipt'] = $receipt;
        $order = new Order;
        if (isset($receipt->id)) {
            if ($is_return) {
                $receipt_data = array(
                    'user_id' => Auth::user()->id,
                    'order_id' => $order_id,
                    'checkbox_return_receipt_id' => $receipt->id
                );
            } else {
                $receipt_data = array(
                    'user_id' => Auth::user()->id,
                    'order_id' => $order_id,
                    'checkbox_receipt_id' => $receipt->id
                );
            }
            $data = $order->addOrUpdate($receipt_data);
        }

        if (isset($receipt->message)) {
            $this->json['error'] = $receipt->message;
        }
        return $this->json;
    }

    public function getReceiptHtml(CheckboxGetReceiptRequest $request)
    {
        $receipt_id = $request->input('receipt_id');

        if ($receipt_id) {
            $receipt = $this->checkbox->getReceiptHtml($receipt_id);
            if (isset($receipt->massage)) {
                return response()->json([
                    'error' => $receipt->massage,
                ]);
            }
            return response()->json($receipt);
        }

        return response()->json(['error' => 'Server error']);
    }

    public function getZReport()
    {
        $shifts = $this->checkbox->getShifts();
        if (isset($shifts->massage)) {
            return response()->json([
                'error' => $shifts->massage,
            ]);
        }
        $z_report_id = '';
        if (isset($shifts['results'])) {
            foreach ($shifts['results'] as $shift) {
                if ($shift->z_report && $shift->z_report->is_z_report) {
                    $z_report_id = $shift->z_report->id;
                    break;
                }
            }
        }

        if ($z_report_id) {
            $html = $this->checkbox->getReportText($z_report_id);
            echo str_replace(PHP_EOL, '<br>', $html);
        } else {
            echo 'Звітів не знайдено';
        }
    }

    public function createCashierShift()
    {
        $shift = $this->checkbox->connect();

        if (isset($shift->massage)) {

            $this->json['error'] = $shift->massage;
        }
        return json_encode($this->json);
    }

    public function closeCashierShift()
    {
        $shift = $this->checkbox->disconnect();
        if (isset($shift->message)) {
            $this->json['error'] = '<pre style="color: blue">'.print_r($shift->message, 1).'</pre>';
            return json_encode($this->json['error']);
        }
        return [];
    }

    public function createServiceReceipt(CheckboxServiceReceipt $request)
    {
        $cash = $request->input('cash');

        $cash_val = (int) ((float) $cash * 100);

        $shift = $this->checkbox->createServiceReceipt($cash_val);
        if (isset($shift->message)) {
            $this->json['error'] = $shift->message;
        } elseif (isset($shift->shift)) {
            $this->json['balance'] = (float) $shift->shift->balance->balance / 100;
        }

        return response()->json($this->json);
    }


    public function getShiftStatus()
    {
        $status = 'CLOSED';
        $shift_id = '';
        $date = '';
        $is_connected = false;
        $balance = '';


        $shift = $this->checkbox->getCurrentCashierShift();
        if (isset($shift->massage)) {
            return response()->json([
                'error' => $shift->massage,
                'shift_id' => $shift_id,
                'is_connected' => $is_connected,
                'status' => $status,
                'balance' => $balance
            ]);
        }
        if ($shift) {
            $shift_id = isset($shift['id']) ? $shift['id'] : '';
            $is_connected = isset($shift['status']) && ($shift['status'] == 'OPENED');
            $status = isset($shift['status']) ? $shift['status'] : $status;

            if (isset($shift['opened_at'])) {
                $date = date('d.m.Y H:i', strtotime($shift['opened_at']));
            }
            if (isset($shift['closed_at'])) {
                $date = date('d.m.Y H:i', strtotime($shift['closed_at']));
            }
            if (isset($shift['balance']->balance)) {
                $balance = number_format(substr($shift['balance']->balance, 0, -2), 0, '',
                        ' ').'.'.substr($shift['balance']->balance, -2);
            }
        }

        if (in_array($status, ['CLOSED', 'CLOSING'])) {
            $status = '<span style="color: red">'.$status.'</span>';
        }

        if (in_array($status, ['OPEN', 'OPENING', 'CREATED'])) {
            $status = '<span style="color: blue">'.$status.'</span>';
        }
        if (in_array($status, ['OPENED'])) {
            $status = '<span style="color: green">'.$status.'</span>';
        }

        $status = $status.'<br>'.$date;
        return response()->json([
            'shift_id' => $shift_id,
            'is_connected' => $is_connected,
            'status' => $status,
            'balance' => $balance
        ]);
    }

    public function getOrders(Request $request)
    {
        $shop = Auth::user();
        $params = array(
            'limit' => 50
        );
        if ($request->input('link')) {
            $link = $request->input('link');
            $params['page_info'] = $link;
        }

        $shopApi = $shop->api()->rest('GET', '/admin/api/unstable/orders.json', $params);
        if ($shopApi->status) {
            return response()->json(array(
                'orders' => $shopApi->body->orders,
                'links' => $shopApi->link
            ));
        } else {
            return response()->json(false);
        }
    }

    public function getOrder($order_id)
    {
        $order = $this->checkbox->getOrder($order_id);
        $recipeInfo = User::find(Auth::user()->id)->orders()->where('order_id', $order_id)->first();
        if ($recipeInfo) {
            $order->checkbox_receipt_id = $recipeInfo->checkbox_receipt_id;
            $order->checkbox_return_receipt_id = $recipeInfo->checkbox_return_receipt_id;
        } else {
            $order->checkbox_receipt_id = false;
            $order->checkbox_return_receipt_id = false;
        }

        return response()->json($order);
    }
}
