/*jslint browser: true, undef: true *//*global Ext*/
/**
 *
 */
Ext.define('Jarvus.monaco.Editor', {
    extend: 'Ext.Component',
    xtype: 'jarvus-monaco-editor',

    config: {
        source: 'min',
        content: null,
        language: 'javascript',
        monaco: null
    },

    /**
     * Modern toolkit does not have the "afterRender" method that exists in the classic toolkit so on initialize
     * a listener is added for the first firing of the painted event which calls afterRender
     */
    initialize: function() {
        var me = this;

        me.on('painted', function() {
            me.afterRender();
            // painted isn't listenable in the controller, this will fire it once
            me.fireEvent('painted', me);
        }, me, {single: true});
    },

    afterRender: function() {
        var me = this;

        me.initEditor();
    },

    initEditor: function() {
        var me = this;

        require.config({
            /*
             * TODO: is there a better way to set this path? See discussion here:
             * https://www.sencha.com/forum/showthread.php?291559-Referencing-resources-from-packages-in-dev-mode
             * For this to work in dev mode, you must build build the app at least once
             */
            baseUrl: '../build/production/EmergenceDbtool/resources/jarvus-monaco-editor/monaco-editor',
            paths: {
                'vs': me.getSource()+'/vs'
            }
        });
        require(['vs/editor/editor.main'], function() {
            me.setMonaco(monaco.editor.create(document.getElementById(me.el.id), {
                value: me.getContent(),
                language: me.getLanguage()
            }));
        });
    }

});
