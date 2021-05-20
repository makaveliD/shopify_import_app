<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $fillable = [
        'checkbox_rro_login',
        'checkbox_rro_password',
        'checkbox_rro_cashbox_key',
        'checkbox_rro_is_dev',
        'checkbox_status',
    ];


}
