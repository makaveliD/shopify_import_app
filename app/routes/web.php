<?php

use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', function () {
    $shop = Auth::user();
    $shopApi = $shop->api()->rest('GET', '/admin/api/unstable/orders.json');
    dd($shopApi);
    exit();
    return view('welcome');
})->middleware(['auth.shopify'])->name('home');
Route::get('/settings', [SettingsController::class, 'index'])->middleware(['auth.shopify'])->name('home');
Route::post('/settings/update',
    [SettingsController::class, 'updateSettings'])->middleware(['auth.shopify'])->name('home');
