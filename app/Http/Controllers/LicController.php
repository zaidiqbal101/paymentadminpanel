<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Lic;

use Illuminate\Http\Request;

class LicController extends Controller
{

    public function licdashboard(){
        return Inertia::render('Admin/licDashboard');
    }


    public function fetchlicdata(){
        $data= Lic::all();
        return response()->json(['data'=>$data]);

    }
}
