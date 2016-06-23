//= require tinymce/js/tinymce/tinymce.min
//= require tinymce/js/tinymce/jquery.tinymce.min
$(document).ready(function() {

  window.tinymce.suffix = '.min';
  window.tinymce.baseURL = '/assets/tinymce/js/tinymce/';

  var file_selection = function(id){
    return function(sel){
      if(sel){
        $('#'+id).val(sel[0].original_path.replace(/\?\d+$/, ''));

        tinyMCE.activeEditor.windowManager.windows[0].find('#alt').value(sel[0].description);

        var fieldElm = $('#'+id)[0];
        if("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          fieldElm.dispatchEvent(evt);
        }else{
          fieldElm.fireEvent("onchange");
        }
      }
    }
  };

  var callback = (WEBY.repositoryDialogInstance || WEBY.getTargetDialog)? function(id, value, ftype){
    if(ftype == 'image'){
      if(WEBY.getRepositoryDialog){
        WEBY.getRepositoryDialog().open({
          file_types: ["image"],
          selected: value,//$("input[name='"+uniqlink.data('field-name')+"']"),
          multiple: false,
          include_others: true,
          onsubmit: file_selection(id)
        });
      }else{
        //tinyMCE.activeEditor.windowManager.alert('Não implementado!');
      }
    }else if(ftype == 'file'){
      if(WEBY.getTargetDialog){
        WEBY.getTargetDialog().open({
          editable_url: true,
          onsubmit: function(sel, url){
            $('#'+id).val(url);
          }
        });
      }else{
        //tinyMCE.activeEditor.windowManager.alert('Não implementado!');
      }
    }else if(ftype == 'media'){
      if(WEBY.getRepositoryDialog){
        WEBY.getRepositoryDialog().open({
          file_types: ["video"],
          selected: value,//$("input[name='"+uniqlink.data('field-name')+"']"),
          multiple: false,
          onsubmit: file_selection(id)
        });
      }else{
        //tinyMCE.activeEditor.windowManager.alert('Não implementado!');
      }
    }
  } : null;

  var editorSetup = function(ed){
    ed.on('NodeChange', function(e){
      var respClass = 'responsive-img';
      if (e && e.element.nodeName.toLowerCase() == 'img' && !e.element.classList.contains(respClass)){
        var width = e.element.width, height = e.element.height;
        //Is this really necessary?
        //tinyMCE.DOM.setAttribs(e.element, {
        //  'style': 'width:' + width + 'px; height:' + height + 'px;'
        //});
      }
    });
    ed.on('submit', function(e) {
      $(ed.contentDocument).find('img').each(function(){
        var $this = $(this);
        var match_url = $this.attr('src').match(/^(.*\/up\/\d+\/)(\w+)(\/.*)$/);

        if(match_url){
          var image_lil = match_url[1] + "l" + match_url[3];
          var image_med = match_url[1] + "m" + match_url[3];
          var image_big = match_url[1] + "o" + match_url[3]; //TODO to be replaced with big size

          $this.attr('data-src', $this.attr('src'));
          $this.attr('src', null);
          $this.addClass('responsive-img');
          $this.attr('srcset', image_lil + " 190w, " + image_med + " 400w, " + image_big + " 3000w");
          $this.attr('sizes', '(max-width: 480px) 100vw');
          // var fig = tinyMCE.DOM.create('figure', {},
          //   //tinyMCE.DOM.create('source', {src: image_lil, media: '(min-width: 400px)'}).outerHTML +
          //   //tinyMCE.DOM.create('source', {src: image_med, media: '(min-width: 800px)'}).outerHTML +
          //   e.element.outerHTML +
          //   tinyMCE.DOM.create('figcaption', {}, e.element.alt).outerHTML
          // );
          //console.log(fig.outerHTML);
          //tinyMCE.DOM.replace(fig, e.element);
        }
        /***** End responsive images *****/
      });
    });
    ed.on('init', function(e) {
      $(ed.contentDocument).find('img.responsive-img[data-src]').each(function(){
        var $this = $(this);
        $this.attr('src', $this.attr('data-src'));
      });
    });
  };

  $('textarea.mceAdvance').tinymce({
    plugins: [
       "advlist autolink link image lists charmap preview hr anchor",
       "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media",
       "table contextmenu directionality paste textcolor"
    ],
    toolbar1: "undo redo | bold italic underline strikethrough |  alignleft aligncenter alignright alignjustify | styleselect | fontsizeselect",
    toolbar2: "forecolor backcolor | bullist numlist outdent indent | link unlink anchor image media | removeformat | code preview fullscreen",
    language: $("html").attr("lang"),
    extended_valid_elements: "img[*],div[*],span[*],iframe[src|width|height|name|align|frameborder|scrolling|id|onload],applet[code|codebase|archive|name|id|width|height|param],video[*],source[*],audio[*],picture[*],figure[*]",
    //paste_word_valid_elements: "@[style,class],-strong/b,-em/i,-span,-p,-ol,-ul,-li,-table,-tr[*],-td[colspan|rowspan],-th[*],-thead,-tfoot,-tbody,-a[href|name],sub,sup,strike,br,u",
    menubar: "edit format insert table view",
    browser_spellcheck : true,
    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
    image_advtab: true,
    relative_urls: false,
    toolbar_items_size: 'small',
    file_browser_callback: callback,
    setup: editorSetup,
    resize: "both"
  });

  $('textarea.mceSimple').tinymce({
    plugins: [
       "advlist autolink link image lists charmap preview hr anchor",
       "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media",
       "table contextmenu directionality paste textcolor"
    ],
    menubar: "edit format insert table view",
    browser_spellcheck : true,
    relative_urls: false,
    toolbar_items_size: 'small',
    file_browser_callback: callback,
    toolbar: "undo redo | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link unlink image | removeformat | code preview fullscreen",
    language : $("html").attr("lang"),
    extended_valid_elements: "img[*],div[*],span[*],iframe[src|width|height|name|align|frameborder|scrolling|id|onload],applet[code|codebase|archive|name|id|width|height|param],video[*],source[*],audio[*],picture[*],figure[*]",
    setup: editorSetup,
    resize: "both"
  });

});
