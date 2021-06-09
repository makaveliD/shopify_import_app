<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImportProductController extends Controller
{
    //

    public function importFromCsv(Request $request)
    {
        ini_set('auto_detect_line_endings', true);
        $file_n = $request->file('csv_file')->getPathname();
        $file = fopen($file_n, 'r');

        $keys = collect(fgetcsv($file));
        $keys->transform(function ($element) {
            return strtolower($element);
        });
        $prevHandle = false;
        $csvProduct = collect();

        while (($csvProductData = fgetcsv($file)) !== false) {
            $csvProductData = $keys->combine($csvProductData);
            if ($prevHandle == false || $csvProduct->isEmpty()) {
                $csvProduct = $csvProductData;
            } else {
                if ($prevHandle == $csvProductData->get('handle')) {
                    $values = collect($csvProduct->get('alias'));
                    $values->push($csvProductData->toArray());
                    $csvProduct->put('alias', $values->toArray());
                } else {
                    $productJson = $this->formatProductToJson($csvProduct->toArray());
                    $this->setProduct($productJson);
                }
            }

            $prevHandle = $csvProduct->get('handle');
        }
        fclose($file);
    }

    protected function formatProductToJson(array $productData): string
    {
        $productDataCollection = collect($productData);
        dump($productDataCollection->all());

        $productJson = collect([
            "handle" => $productDataCollection->get('handle'),
            "title" => $productDataCollection->get('title'),
            "body_html" => $productDataCollection->get('body (html)'),
            "product_type" => $productDataCollection->get('type'),
            "status" => $productDataCollection->get('status'),
            "vendor" => $productDataCollection->get('vendor'),
            "published" => $productDataCollection->get('published')
        ]);

        if ($productDataCollection->has('alias')) {
            $variants = collect();
            $aliases = collect($productDataCollection->get('alias'));
            foreach ($aliases->toArray() as $alias) {
                $variant = collect();
                $alias = collect($alias);
                if ($alias->get('option1 value')) {
                    if ($alias->get('option1 value')) {
                        $variant->put('option1', $alias->get('option1 value'));
                    }
                    if ($alias->get('option2 value')) {
                        $variant->put('option2', $alias->get('option2 value'));
                    }
                    if ($alias->get('option3 value')) {
                        $variant->put('option3', $alias->get('option3 value'));
                    }
                    $variant->put('sku', $alias->get('variant sku'));
                    $variant->put('price', $alias->get('variant price'));
                    $alias->has('variant compare at price') ?? $variant->put(
                        'compare_at_price',
                        $alias->get('variant compare at price')
                    );
                    $variant->put('inventory_quantity', $alias->get('variant inventory qty'));
                    $variant->put('fulfillment_service', $alias->get('variant fulfillment service'));
                    $variant->put('inventory_policy', $alias->get('variant inventory policy'));
                    $variant->put('requires_shipping', $alias->get('variant requires shipping'));
                    $variant->put('weight_unit', $alias->get('variant weight unit'));
                    $variants->push($variant->toArray());
                }
            }
            if ($variants->isNotEmpty()) {
                $productJson->put('variants', $variants->toArray());
            }
            $shop = Auth::user();
            $shopApi = $shop->api()->rest(
                'POST',
                '/admin/api/2021-04/products.json',
                ['product' => $productJson->toArray()]
            );
            dd($shopApi);
        }
//        "tags" => [
//
//    ]


        return true;
    }

    protected function setProduct(string $productJson): bool
    {

        return true;
    }
}
