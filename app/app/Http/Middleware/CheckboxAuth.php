<?php

namespace App\Http\Middleware;

use App\Library\Checkbox;
use App\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class CheckboxAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $checkBox = app(Checkbox::class);
        $checkBox->setup(Auth::user()->settings);
        return $next($request);
    }
}
