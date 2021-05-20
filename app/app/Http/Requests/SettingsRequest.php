<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'checkbox_rro_is_dev'=>'required|boolean',
            'checkbox_status'=>'required|boolean',
        ];
    }
    public function messages()
    {
        return [
            'checkbox_rro_is_dev.required' => 'Status is required!',
            'checkbox_status.required' => 'Status is required!',
        ];
    }
}
