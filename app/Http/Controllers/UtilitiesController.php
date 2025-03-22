<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\UtilityMunicipality;
use App\Models\UtilityLPG;
use App\Models\UtilityFastag;
use App\Models\UtilityBillpayment;
use App\Models\UtilityInsurance;



use Illuminate\Http\Request;

class UtilitiesController extends Controller
{
  
    public function billpaymentdashboard(){
        return Inertia::render('Admin/utilities/billpaymentDashboard');
    }
    public function insurancepaymentdashboard(){
        return Inertia::render('Admin/utilities/insurancepaymentDashboard');
    }
    public function fastagrechargedashboard(){
        return Inertia::render('Admin/utilities/fastagrechargeDashboard');
    }
    public function lpgbookingdashboard(){
        return Inertia::render('Admin/utilities/lpgbookingDashboard');
    }
    public function municipalitypaymentdashboard(){
        return Inertia::render('Admin/utilities/municipalitypaymentDashboard');
    }

    public function municipalitypaymentdata(){
        $data=UtilityMunicipality::all();
        return response()->json(['data'=>$data]);
    }

    public function billpaymentdata(){
        $data=UtilityBillpayment::all();
        return response()->json(['data'=>$data]);
    }
    public function insurancepaymentdata(){
        $data=UtilityInsurance::all();
        return response()->json(['data'=>$data]);
    }
    public function fastagrechargedata(){
        $data=UtilityFastag::all();
        return response()->json(['data'=>$data]);
    }
    public function lpgbookingdata(){
        $data=UtilityLPG::all();
        return response()->json(['data'=>$data]);
    }
}
