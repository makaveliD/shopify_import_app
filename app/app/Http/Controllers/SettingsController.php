<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingsRequest;
use App\Settings;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
    public function index()
    {
        $data = User::find(Auth::user()->id)->settings;

        return response()->json($data);

    }

    public function updateSettings(SettingsRequest $request)
    {
        User::find(Auth::user()->id)->settings->update($request->all());

        return response()->json('success');

    }
}
