<?php

namespace App\Library;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Auth;
use stdClass;


class Checkbox
{

    protected $login;

    protected $password;

    protected $cashbox_key;

    protected $is_dev;

    protected $access_token = '';

    public function __construct()
    {
    }

    public function setup($settings)
    {
        $this->login = $settings->checkbox_rro_login;
        $this->password = $settings->checkbox_rro_password;
        $this->cashbox_key = $settings->checkbox_rro_cashbox_key;
        $this->is_dev = $settings->checkbox_rro_is_dev;
        $this->getBearToken();
    }

    public function getBearToken()
    {
        $params = ['login' => $this->login, 'password' => $this->password];
        $response = $this->makePostRequest('/api/v1/cashier/signin', $params);
        $this->access_token = $response->access_token ?? '';
    }

    private function makePostRequest($route, $params = [], $header_params = [])
    {
        $url_host = $this->is_dev ? 'https://dev-api.checkbox.in.ua' : 'https://api.checkbox.in.ua';
        $url = $url_host.$route;
        $header = ['Content-type' => 'application/json'];

        if ($this->access_token) {
            $header = array_merge($header, ['Authorization: Bearer '.trim($this->access_token)]);
        }

        if (isset($header_params['cashbox_key'])) {
            $header = array_merge($header, ['X-License-Key: '.$header_params['cashbox_key']]);
        }
        $header = array_merge($header, ['X-Client-Name: ssss']);
        $header = array_merge($header, ['X-Client-Version: 2']);


        $client = new Client();
        try {
            $response = $client->request(
                'POST',
                $url,
                [
                    'curl' => [
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 0,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_POSTFIELDS => json_encode($params),
                        CURLOPT_HTTPHEADER => $header,
                    ]
                ]
            );
        } catch (GuzzleException $e) {
            $brokenResponse = $e->getResponse();
            if ($brokenResponse->getStatusCode() > 400) {
                $response = new stdClass();
                $response->massage = 'Server error';
                return $response;
            } else {
                $response = new stdClass();
                $response->massage = $e->getResponse()->getBody()->getContents();
            }
        }
        return json_decode($response->getBody()->getContents());
    }

    public function connect()
    {
        $cashbox_key = $this->cashbox_key;
        $header_params = ['cashbox_key' => $cashbox_key];
        return $this->makePostRequest('/api/v1/shifts', [], $header_params);
    }

    public function disconnect()
    {
        return $this->makePostRequest('/api/v1/shifts/close');
    }

    public function getShifts()
    {
        $url = '/api/v1/shifts?desc=true';
        return $this->makeGetRequest($url);
    }

    private function makeGetRequest($route, $params = [], $header_params = [], $echo = false)
    {
        $url_host = $this->is_dev ? 'https://dev-api.checkbox.in.ua' : 'https://api.checkbox.in.ua';
        $url = $url_host.$route;
        $header = ['Content-type' => 'application/json'];
        if ($this->access_token) {
            $header = array_merge($header, ['Authorization: Bearer '.trim($this->access_token)]);
        }
        if (isset($header_params['cashbox_key'])) {
            $header = array_merge($header, ['X-License-Key: '.$header_params['cashbox_key']]);
        }

        $header = array_merge($header, ['X-Client-Name: shhygolvv_khm']);
        $header = array_merge($header, ['X-Client-Version: 1']);

        if ($params) {
            $params = http_build_query($params);
        } else {
            $params = '';
        }
        $client = new Client();
        $response = '';
        try {
            $response = $client->request(
                'GET',
                $url,
                [
                    'curl' => [
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_SSL_VERIFYPEER => false,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 0,
                        CURLOPT_FOLLOWLOCATION => true,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => "GET",
                        CURLOPT_HTTPHEADER => $header,
                    ]
                ]
            );
        } catch (GuzzleException $e) {
            $brokenResponse = $e->getResponse();
            if ($brokenResponse->getStatusCode() > 400) {
                $response = new stdClass();
                $response->massage = 'Server error';
                return $response;
            }
        }

        if ($response->getStatusCode() < 400) {
            if ($echo) {
                return $response->getBody()->getContents();
            } else {
                return (array)json_decode($response->getBody());
            }
        } else {
            return [];
        }
    }

    public function getCurrentCashierShift()
    {
        $url = '/api/v1/cashier/shift';
        return $this->makeGetRequest($url);
    }

    public function getCurrentCashboxInfo()
    {
        $url = '/api/v1/cash-registers/info';
        $header_params = ['cashbox_key' => $this->cashbox_key];
        return $this->makeGetRequest($url, [], $header_params);
    }

    public function checkConnection($shift_id)
    {
        $url = '/api/v1/shifts/'.$shift_id;
        return $this->makeGetRequest($url);
    }

    public function getZReports()
    {
        $url = '/api/v1/reports/?is_z_report=true';
        return $this->makeGetRequest($url);
    }

    public function getReportText($report_id)
    {
        $url = '/api/v1/reports/'.$report_id.'/text/';
        return $this->makeGetRequest($url, [], [], true);
    }

    public function getReceiptHtml($receipt_id)
    {
        $url = '/api/v1/receipts/'.$receipt_id.'/html/';
        return $this->makeGetRequest($url, [], [], true);
    }

    public function getReceipt($receipt_id)
    {
        $url = '/api/v1/receipts/'.$receipt_id;

        return $this->makeGetRequest($url);
    }

    public function createServiceReceipt($cash)
    {
        $params = [
            'payment' => [
                'type' => 'CASH',
                'value' => $cash,
            ]
        ];
        return $this->makePostRequest('/api/v1/receipts/service', $params);
    }

    public function create_receipt($params)
    {
        return $this->makePostRequest('/api/v1/receipts/sell', $params);
    }

    public function getOrder($order_id)
    {
        $shop = Auth::user();
        $shopApi = $shop->api()->rest('GET', "/admin/api/unstable/orders/$order_id.json");
        if ($shopApi->status) {
            return $shopApi->body->order;
        } else {
            return false;
        }
    }
}
