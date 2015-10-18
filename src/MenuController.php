<?php

namespace Zhuayi\BaseAdmin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Zhuayi\BaseAdmin\Models\Permission;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function getIndex()
    {
        $wherName = trim(\Input::get('name'));

        if ($wherName) {
            $show['permissions'] = Permission::where('description','like','%'.$wherName.'%')->orWhere('name','like','%'.$wherName.'%')->orderBy('id','desc')->get();
        } else {
            $show['permissions'] = Permission::all();
        }

        return View('admin.menu.index', ['title' => '后台管理 - 权限管理', 'show' => $show]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function postCreate(Request $request)
    {
        if ($request->get('id')) {

            return $this->update($request, $request->get('id'));
        } else {
            return $this->store($request);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $permission = new Permission;
        $permission->name = trim($request->get('name'));
        $permission->description = trim($request->get('description'));
        $permission->power = trim($request->get('power'));
        $permission->isDisplay = trim($request->get('isDisplay'));
        $permission->save();
        return redirect()->to('/admin/menu/')->withErrors("操作成功");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function getAdd()
    {
        return View('admin.menu.edit', ['title' => '后台管理 - 权限管理', 'show' => array()]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function getEdit($id)
    {
        $show['permission'] = Permission::where('id','=', $id)->first();
        return View('admin.menu.edit', ['title' => '后台管理 - 权限管理', 'show' => $show]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        // 检查角色是否存在
        $permission = Permission::where('id', '=', $id)->first();
        if (empty($permission)) {
            return redirect()->to('/admin/menu/edit/')->withErrors("找不到该权限");
        }
        
        $permission->name = trim($request->get('name'));
        $permission->description = trim($request->get('description'));
        $permission->power = trim($request->get('power'));
        $permission->isDisplay = trim($request->get('isDisplay'));
        $permission->save();
       
        return redirect()->to('/admin/menu/')->withErrors("操作成功");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function getDestroy($id)
    {
        $permission = Permission::where('id','=', $id)->first();
        if (empty($permission)) {

            return redirect()->to('/admin/menu/')->withErrors("删除失败");
        }
        $permission->delete();

        return redirect()->to('/admin/menu/')->withErrors("删除成功");
    }
}