<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Beneficiary1Data;
use App\Models\Beneficiary2Data;
use App\Models\Roles;
use App\Models\Permissions;
use Illuminate\Http\Request;  // ✅ CORRECT



class MainController extends Controller
{

    public function beneficary1(){
     
        $data= Beneficiary1Data::all();
        return response()->json(['data'=>$data]);

    }

    public function beneficary2(){
     
        $data= Beneficiary2Data::all();
        return response()->json(['data'=>$data]);

    }

    public function displaypermissions(){
        return Inertia::render('Admin/roles&permissions/permissions');
    }
    
    public function permissions(){
        $data = Permissions::all();
        return response()->json(['data'=>$data]);
    }

    public function addPermission(Request $request){
    $request->validate([
        'name'=>'required|string|max:255',
        'display_name'=>'required|string|max:255',
        'type'=>'required|string|max:255',
    ]);
    
    $permission = new Permissions();
    $permission->name= $request->name;
    $permission->display_name=$request->display_name;
    $permission->type= $request->type;
    $permission->save();

    return response()->json(['message'=>'Permission added successfully','data'=>$permission],201);

    }
    public function updatePermission(Request $request, $id) {
    $permission = Permissions::find($id);

    if (!$permission) {
        return response()->json(['message' => 'Permission not found'], 404);
    }

    $updated = false;

    if ($request->has('name') && $permission->name !== $request->name) {
        $permission->name = $request->name;
        $updated = true;
    }

    if ($request->has('display_name') && $permission->display_name !== $request->display_name) {
        $permission->display_name = $request->display_name;
        $updated = true;
    }

    if ($request->has('type') && $permission->type !== $request->type) {
        $permission->type = $request->type;
        $updated = true;
    }

    if ($updated) {
        $permission->save();
        return response()->json(['message' => 'Permission updated successfully', 'data' => $permission]);
    } else {
        return response()->json(['message' => 'No changes made'], 200);
    }
    }
    public function deletePermission($id) {
    $permission = Permissions::find($id);

    if (!$permission) {
        return response()->json(['message' => 'Permission not found'], 404);
    }

    $permission->delete();

    return response()->json(['message' => 'Permission deleted successfully']);
    }


    public function displayroles(){
        return Inertia::render('Admin/roles&permissions/roles');
    }
// app/Http/Controllers/RoleController.php
public function getRoles()
{
    $roles = Roles::with('permissions')->get(); // Ensure this eager loads permissions
    return response()->json(['data' => $roles]);
}

public function updateRolePermissions(Request $request, $id)
{
    $role = Roles::find($id);

    if (!$role) {
        return response()->json(['message' => 'Role not found'], 404);
    }

    $permissionIds = $request->input('permissions', []);
    $role->permissions()->sync($permissionIds); // Syncs the permissions

    return response()->json(['message' => 'Role permissions updated successfully', 'data' => $role->permissions]);
}
public function addRole(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'display_name' => 'required|string|max:255',
    ]);
    
    $role = new Roles();
    $role->name = $request->name;
    $role->display_name = $request->display_name;
    $role->last_update = now();
    $role->save();

    return response()->json(['message' => 'Role added successfully', 'data' => $role], 201);
}

public function updateRole(Request $request, $id)
{
    $role = Roles::find($id);

    if (!$role) {
        return response()->json(['message' => 'Role not found'], 404);
    }

    $updated = false;

    if ($request->has('name') && $role->name !== $request->name) {
        $role->name = $request->name;
        $updated = true;
    }

    if ($request->has('display_name') && $role->display_name !== $request->display_name) {
        $role->display_name = $request->display_name;
        $updated = true;
    }

    if ($updated) {
        $role->last_update = now();
        $role->save();
        return response()->json(['message' => 'Role updated successfully', 'data' => $role]);
    } else {
        return response()->json(['message' => 'No changes made'], 200);
    }
}

public function deleteRole($id)
{
    $role = Roles::find($id);

    if (!$role) {
        return response()->json(['message' => 'Role not found'], 404);
    }

    $role->delete();
    return response()->json(['message' => 'Role deleted successfully']);
}

}