<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\CMSAirtel;



use Illuminate\Http\Request;

class CMSController extends Controller
{
 public function cmsairteldashboard(){
    return Inertia::render('Admin/cms/airtel');
 }
public function cms_airtel_fetch(){
    {
        $data =  CMSAirtel::all();
        return response()->json(['data'=>$data]);
    }
}

}
