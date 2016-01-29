/**
 * Created by nerd on 16/1/21.
 */

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

        var index = a.indexOf(b);
        if (index >= 0) {

            a.splice(index, 1);
        }
        return a;

    };

    var _PermTreeManager = {

        // check target node and parent node if exists
        checkPerm: function(event, node) {

            var treeView = $(event.target),
                parentId = node.parentId;

            if (undefined == parentId) { // if children node

                $(treeView).treeview(true).checkNode(node.nodeId); // just check itself
                var children = node.nodes, // get children
                    length = children.length,
                    ifCheckChildren = true;

                for (var i = 0; i < length; i++) { // loop to check if there is need to check children

                    var child = children[i];
                    if (child.state.checked) {

                        ifCheckChildren = false;
                        break;
                    }
                }

                if (ifCheckChildren) {

                    this.checkChildren(treeView, children)
                }

            } else { // if parent node

                $(treeView).treeview(true).checkNode(parentId);
            }
        },
        // uncheck target node and child nodes if exist
        uncheckPerm: function(event, node) {

            var children = node.nodes,
                treeView = $(event.target);

            if (children) {

                var length = children.length;
                for (var i = 0; i < length; i++) {

                    var child = node.nodes[i];
                    $(treeView).treeview(true).uncheckNode(child.nodeId);
                }
            }

            $(treeView).treeview(true).uncheckNode(node.nodeId);
            this.uncheckParent(event, node);
        },
        // check parent if exists
        checkChildren: function(treeView, children) {

            var length = children.length;

            for (var i = 0; i < length; i++) {

                var child = children[i];
                $(treeView).treeview(true).checkNode(child.nodeId);
            }
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
                        break;
                    }
                }

                if (ifUncheckParent) {

                    $(treeView).treeview(true).uncheckNode(parent.nodeId);
                }
            }
        }

    };

    var _onNodeChecked = function(event, node) {

        _PermTreeManager.checkPerm(event, node);

        var permission_ids_elem = $("#permission_ids");
        var permission_ids = $(permission_ids_elem).val();

        if (permission_ids == "") {

            permission_ids = [];
        } else {

            permission_ids = permission_ids.split(",").map(function(elem) {
                return parseInt(elem);
            });
        }

        permission_ids = permission_ids.concat(node.href).unique().sort();

        $(permission_ids_elem).val(permission_ids.join(','));
    };

    var _onNodeUnchecked = function(event, node) {

        _PermTreeManager.uncheckPerm(event, node);

        var permission_ids_elem = $("#permission_ids");
        var permission_ids = $(permission_ids_elem).val();

        if ("" == permission_ids) {

            permission_ids = [];
        } else {

            permission_ids = permission_ids.split(",").map(function (elem) {
                return parseInt(elem);
            });
        }

        permission_ids = Array.minus(permission_ids, node.href).sort();
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
