<?php

namespace App\Providers;

use App\Library\CsvParser;
use Illuminate\Support\ServiceProvider;

class CsvParserServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
	    $this->app->singleton(CsvParser::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
