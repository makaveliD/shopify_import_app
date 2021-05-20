<?php

use App\Http\Controllers\CheckboxController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::get('/orders', [CheckboxController::class, 'getOrders'])->middleware(['auth.shopify']);

Route::get('/orders/{id}', [CheckboxController::class, 'getOrder'])->middleware(['auth.shopify']);
Route::get('/checkbox', [CheckboxController::class, 'index'])->middleware(['auth.shopify']);
Route::get('/checkbox/create_receipt', [CheckboxController::class, 'createReceipt'])->middleware([
    'auth.shopify', 'checkbox.auth'
]);
Route::get('/checkbox/get_shift_status', [CheckboxController::class, 'getShiftStatus'])->middleware([
    'auth.shopify', 'checkbox.auth'
]);
Route::get('/checkbox/create_cashier_shift',
    [CheckboxController::class, 'createCashierShift'])->middleware(['auth.shopify', 'checkbox.auth']);
Route::get('/checkbox/close_cashier_shift',
    [CheckboxController::class, 'closeCashierShift'])->middleware(['auth.shopify', 'checkbox.auth']);
Route::get('/checkbox/get_z_report', [CheckboxController::class, 'getZReport'])->middleware([
    'auth.shopify', 'checkbox.auth'
]);
Route::get('/checkbox/create_service_receipt',
    [CheckboxController::class, 'createServiceReceipt'])->middleware(['auth.shopify', 'checkbox.auth']);
Route::get('/checkbox/create_receipt', [CheckboxController::class, 'createReceipt'])->middleware([
    'auth.shopify', 'checkbox.auth'
]);
Route::get('/checkbox/get_receipt_html', [CheckboxController::class, 'getReceiptHtml'])->middleware([
    'auth.shopify', 'checkbox.auth'
]);
Route::get('/settings', [SettingsController::class, 'index'])->middleware(['auth.shopify']);
Route::post('/settings/update',
    [SettingsController::class, 'updateSettings'])->middleware(['auth.shopify']);
