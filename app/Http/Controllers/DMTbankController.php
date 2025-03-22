<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\DMTbank;



use Illuminate\Http\Request;

class DMTbankController extends Controller
{
    public function dmt2dashboard(){
        return Inertia::render('Admin/dmtbank2Dashboard');
    }
    
    public function fetchdmt2(){ 
        {
         $data =  DMTbank::all();
         return response()->json(['data'=>$data]);
     }
    }
}
