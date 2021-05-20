<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="{{asset('css/app.css')}}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Polaris Demo</title>
</head>
<body>
<div id="app"></div>

<input type="hidden" id="apiKey" value="{{ config('shopify-app.api_key') }}">
<input type="hidden" id="shopOrigin" value="{{ Auth::user()->name }}">
    <script src="https://unpkg.com/@shopify/app-bridge"></script>
    <script src="https://unpkg.com/@shopify/app-bridge-utils"></script>
    <script>
        var AppBridge = window['app-bridge'];
        const utils = window['app-bridge-utils'];
        var createApp = AppBridge.default;
        const actions = AppBridge.actions;
        var app = createApp({
            apiKey: '{{ config('shopify-app.api_key') }}',
            shopOrigin: '{{ Auth::user()->name }}',
            forceRedirect: true,
        });

    </script>


@yield('scripts')

<script src="{{asset('js/app.js')}}"></script>

</body>
</html>
