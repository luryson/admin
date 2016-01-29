@extends('admin.layouts.layout1')

@section('content')

<link rel="stylesheet" href="{{ asset('/statics/plugin/bootstrap-treeview/css/bootstrap-treeview.css') }}" />
<script src="{{ asset('/statics/plugin/bootstrap-treeview/js/bootstrap-treeview.js') }}"></script>

<!-- Main content -->
<section class="content">
    <div class="row">
        <div class="col-xs-12">
            @if ($errors->all())
            <div class="callout callout-danger">
                <h4>
                @foreach($errors->all() as $error)
                {{ $error }}
                @endforeach
                </h4>
            </div>
            @endif
            <div class="box">
                <form action="{{isset($show['role']->id)?'/admin/role/update/'.$show['role']->id:'/admin/role/create/'}}" method="post" id="form">
                    <div class="box-header">
                    </div><!-- /.box-header -->
                    <div class="box-body table-responsive no-padding">
                        <div class="form-group col-xs-6 col-md-6">
                            <label><span style="width:155px;display:block;">角色名：</span></label>
                            <input name='display_name' type="text" class="form-control" placeholder="角色名" 
                            value='{{isset($show['role']->display_name)?$show['role']->display_name:''}}'/>
                        </div>
                        <div class="form-group col-xs-6 col-md-6">
                            <label><span style="width:155px;display:block;">简介：</span></label>
                            <input name='description' type="text" class="form-control" placeholder="简介" value='{{isset($show['role']->description)?$show['role']->description:''}}'/>
                        </div>
                        <div class="form-group col-xs-6 col-md-6">
                            <label><span style="width:155px;display:block;">标示符：</span></label>
                            <input name='name' type="text" class="form-control" placeholder="标示符" 
                            value='{{isset($show['role']->name)?$show['role']->name:''}}'/>
                        </div>
                        <div class="form-group col-xs-12 col-md-12">
                            <div id="permission-tree"></div>
                        </div>
                        
                        
                    </div>
                    <div class="box-footer text-left">
                        <input name='id' type="hidden"  value='{{isset($show['role']->id)?$show['role']->id:''}}'/>
                        <input id="permission_ids" class="hide" type="hidden" value="{{ implode(",", $show['selected_permissions']) }}" />
                        <button type="submit" class="btn btn-primary" id="saveBtn">保存</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<script src="{{ asset ("/statics/js/permission-tree.js") }}"></script>
<script type="text/javascript">
    $(function () {

        $("#permission-tree").permTreeView({
            permsData: {!! json_encode($treeView) !!}
        });

        $("#saveBtn").click(function(e) {
            e.preventDefault();
            permission_ids = $("#permission_ids").val();

            if ("" != permission_ids) {

                permission_ids = permission_ids.split(",").map(function(elem, index) {
                    return parseInt(elem);
                });
                for (var i = 0; i < permission_ids.length; i++) {

                    $("#form").append('<input name="permission_id[]" id="permission_ids" type="hidden" value='+permission_ids[i]+' />');
                }
            } else {

                $("#form").append('<input name="permission_id[]" id="permission_ids" type="hidden" value="" />');
            }

            $("#form").submit();
        });
    });
</script>

@endsection
