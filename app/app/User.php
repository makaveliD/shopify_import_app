<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;
use Osiset\ShopifyApp\Traits\ShopModel;

class User extends Authenticatable implements IShopModel
{
    use Notifiable;
    use ShopModel;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function settings()
    {
        return $this->hasOne('App\Settings')->withDefault(function ($settings, $user) {

            $settings->fill([
                'checkbox_rro_login' => '',
                'checkbox_rro_password' => '',
                'checkbox_rro_cashbox_key' => '',
                'checkbox_status' => true,
                'checkbox_rro_is_dev' => true,
            ]);
            $user->settings()->save($settings);
        });
    }

    public function orders()
    {
        return $this->hasMany('App\Order');
    }


}
