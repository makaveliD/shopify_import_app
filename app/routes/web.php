<?php

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
    return view('welcome');
})->middleware(['auth.shopify']);
Route::fallback(function () {
    return view('welcome');
})->middleware(['auth.shopify'])->name('home');

//Route::get('/', function () {
//    return view('welcome');
//})->middleware(['auth.shopify']);
//Route::get('/settings', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/orders', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/order/{id}', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/order/', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/checkbox', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/checkbox/get_shift_status', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/checkbox/create_cashier_shift', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//Route::get('/checkbox/close_cashier_shift', function () {
//    return view('welcome');
//})->middleware(['auth.shopify'])->name('home');
//
