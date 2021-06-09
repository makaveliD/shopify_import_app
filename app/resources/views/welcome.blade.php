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

<input type="hidden" id="apiKey" value="{{ config('shopify-app.api_key') }}">
<input type="hidden" id="shopOrigin" value="{{Auth::user()->name }}">

<form action="/import_from_csv" method="post" enctype="multipart/form-data">
    <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
    <input type="file" id="file" name="csv_file">
    <label for="file">File</label>
    <button type="submit">
        submit
    </button>
</form>

@yield('scripts')


</body>
</html>
