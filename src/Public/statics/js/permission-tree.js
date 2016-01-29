;(function ($) {

    'use strict';

    var pluginName = 'permTreeView';

    var defaults = {
        permsData: [],
        showIcon: false
    };

    Array.prototype.unique = function() {

        var res = [];
        var json = {};
        for (var i = 0; i < this.length; i++) {
            if (!json[this[i]]) {
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
        return res;
    };

    Array.minus = function(a, b) {

        var length = b.length;
        for (var item = 0; item < length;  item++) {

            var index = a.indexOf(b[item]);
            if (index >= 0) {

                a.splice(index, 1);
            }
        }
        return a;
    };

    var _PermTreeManager = {

        // check target node and parent node if exists
        checkPerm: function(event, node) {

            var treeView = $(event.target),
                parentId = node.parentId,
                checkedIds = [node.href];

            if (undefined == parentId) { // parent node

                $(treeView).treeview(true).checkNode(node.nodeId);
                var children = node.nodes,
                    length = children.length,
                    ifCheckChildren = true;

                for (var i = 0; i < length; i++) {

                    var child = children[i];
                    if (child.state.checked) {

                        ifCheckChildren = false;
                    }
                }

                if (ifCheckChildren) {

                    checkedIds.concat(this.checkChildren(treeView, children));
                }

            } else { // child node

                $(treeView).treeview(true).checkNode(parentId);
            }

            return checkedIds;
        },
        // uncheck target node and child nodes if exist
        uncheckPerm: function(event, node) {

            var unchecked_ids = [node.href],
                children = node.nodes,
                treeView = $(event.target);

            if (children) {

                var length = children.length;
                for (var i = 0; i < length; i++) {

                    var child = node.nodes[i];
                    $(treeView).treeview(true).uncheckNode(child.nodeId);
                }
            }

            var parent_id = this.uncheckParent(event, node);
            if (parent_id) {

                unchecked_ids.push(parent_id);
            }

            return unchecked_ids;
        },
        // check parent if exists
        checkChildren: function(treeView, children) {

            var checkedIds = [],
                length = children.length;

            for (var i = 0; i < length; i++) {

                var child = children[i];
                $(treeView).treeview(true).checkNode(child.nodeId);
                checkedIds.push(child.href);
            }

            return checkedIds;
        },
        // uncheck parent if siblings are all unchecked
        uncheckParent: function(event, node) {

            var treeView = $(event.target),
                parent = $(treeView).treeview(true).getParent(node.nodeId),
                siblings = $(treeView).treeview(true).getSiblings(node.nodeId);

            if (parent) {

                var ifUncheckParent = true;
                var length = siblings.length;
                for (var i = 0; i < length; i++) {

                    if (siblings[i].state.checked) {

                        ifUncheckParent = false;
                    }
                }

                if (ifUncheckParent) {

                    $(treeView).treeview(true).uncheckNode(parent.nodeId);

                    return parent.href;
                }
            }

            return null;
        }

    };

    var _onNodeChecked = function(event, node) {

        var checked_ids = _PermTreeManager.checkPerm(event, node);

        var permission_ids_elem = $("#permission_ids");
        var permission_ids = $(permission_ids_elem).val();

        if (permission_ids == "") {

            permission_ids = [];
        } else {

            permission_ids = permission_ids.split(",").map(function(elem) {
                return parseInt(elem);
            });
        }

        permission_ids = permission_ids.concat(checked_ids).unique().sort();

        $(permission_ids_elem).val(permission_ids.join(','));
    };

    var _onNodeUnchecked = function(event, node) {

        var unchecked_ids = _PermTreeManager.uncheckPerm(event, node);

        var permission_ids_elem = $("#permission_ids");
        var permission_ids = $(permission_ids_elem).val();

        if ("" == permission_ids) {

            permission_ids = [];
        } else {

            permission_ids = permission_ids.split(",").map(function (elem) {
                return parseInt(elem);
            });
        }

        permission_ids = Array.minus(permission_ids, unchecked_ids).sort();
        $(permission_ids_elem).val(permission_ids.join(','));

    };



    $.fn[pluginName] = function (options) {

        var opts = $.extend({}, defaults, options);

        return this.each(function () {

            var $this = $(this);

            $this.treeview({
                data: opts.permsData,
                showIcon: opts.showIcon,
                showCheckbox: true,
                onNodeChecked: _onNodeChecked,
                onNodeUnchecked: _onNodeUnchecked
            });
        });
    }





})(jQuery);
