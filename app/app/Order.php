<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'checkbox_receipt_id',
        'checkbox_return_receipt_id',
    ];

    public function addOrUpdate($data){
        $order = $this->firstOrCreate(['user_id'=>$data['user_id'],'order_id'=>$data['order_id']] );
        $order->fill($data);
        $order->save();
    }
}
