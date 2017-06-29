//= require jquery.Jcrop.min

$(document).ready(function () {
  var jcrop_api,
      jcropInit = false;
      userValue = false;

  var setValue = function(input, data, value){
    if ($("#repository_"+input).data('raw') != data || value == null){
      $("#repository_"+input).data('raw', data);
      if (typeof(value) == 'undefined' || value == null){
        value = Math.round(data);
      }else if (value % 1 != 0){
        value = Math.round(value);
      }
      $("#repository_"+input).val(value);
    }
  }

  var initJcrop = function(){
    //Após o carregamento da imagem, iniciar o jCrop
    $('#img-crop').load(function(){
      $('.real-size').html('<b>('+this.naturalWidth+'x'+this.naturalHeight+')</b>');
      $(this).Jcrop({
        boxWidth: this.clientWidth,
        boxHeight: this.clientHeight,
        trueSize: [this.naturalWidth, this.naturalHeight],
        onSelect: function (selection) {
          if (!userValue){
            setValue('mask_x', selection.x);
            setValue('mask_y', selection.y);
            setValue('mask_width', selection.w);
            setValue('mask_height', selection.h);
          }
          userValue = false;
        },
        onRelease: function(){
          $("#repository_mask_x").val(null);
          $("#repository_mask_y").val(null);
          $("#repository_mask_width").val(null);
          $("#repository_mask_height").val(null);
        }
      }, function(){
        jcrop_api = this;
        setSelectionFromValues();
      });
    });
    //Iniciar o carregamento da imagem manualmente
    $('#img-crop').attr('src', $('#img-crop').data('src'));
    jcropInit = true;
  }

  var setSelectionFromValues = function(el){
    if (el){
      $(['mask_x','mask_y','mask_width','mask_height']).each(function(){
        if($('#repository_'+this).val().length == 0)
          $('#repository_'+this).val(0);
      });
      userValue = true;
    }
    var x = parseInt($('#repository_mask_x').val()),
        y = parseInt($('#repository_mask_y').val()),
        w = parseInt($('#repository_mask_width').val()),
        h = parseInt($('#repository_mask_height').val()),
        aspect = jcrop_api.getOptions().aspectRatio;
    if(aspect != 0){
      if(el && $(el).is('#repository_mask_width')){
        h = w / aspect;
      }else{
        w = h * aspect;
      }
    }
    if (w > 0 && h > 0){
      jcrop_api.setSelect([x, y, x+w, y+h]);
      var o = jcrop_api.tellSelect();
      //Se o usuário seta um valor que corta pra fora da imagem,
      //muda o valor do campo para o valor real
      if(Math.abs(w - o.w) > 1){
        w = null;
        if(aspect != 0){
          h = null;
        }
      }
      if(Math.abs(h - o.h) > 1){
        h = null;
        if(aspect != 0){
          w= null;
        }
      }
      setValue('mask_width', o.w, w);
      setValue('mask_height', o.h, h);
    }
  }

  //Quando o usuário seta os valores, muda a seleção na imagem
  $('#repository_mask_width, #repository_mask_height').change(function(){
    setSelectionFromValues(this);
  });

  $('.toggle-lock input').change(function(){
    if($(this).is(':checked')){
      $(this).siblings('.glyphicon').removeClass('glyphicon-white');
      var o = jcrop_api.tellSelect();
      jcrop_api.setOptions({aspectRatio: Math.round(o.w)/Math.round(o.h)});
    }else{
      $(this).siblings('.glyphicon').addClass('glyphicon-white');
      jcrop_api.setOptions({aspectRatio: 0});
    }
    return false;
  });

  //Simular o efeito de onchange quando pressiona [enter] e impedir que o formulário seja enviado
  $('#repository_mask_width, #repository_mask_height').keydown(function(e){
    if(e.keyCode == 13){
      $(this).change();
      return false;
    }
  });

  //Se o usuário trocar o arquivo, remover o panel de corte da imagem
  $('#repository_archive').change(function(){
    if(jcrop_api)
      jcrop_api.release();
    $('.img-edit').remove();
    /////Geração do thumbnail de preview (Se o browser tiver o FileReader)
    var img = $('.img-edit-preview img');
    img.hide();
    if (typeof FileReader !== "undefined" && (/image/i).test(this.files[0].type)){
      var reader = new FileReader();
      reader.onload = function(evt){
        img[0].src = evt.target.result;
        img.parent('a').attr('href', '#');
        img.parent('a').attr('target', null);
        img.show();
      };
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Abrir o painel de ediçao
  $('.panel-heading').click(function(){
    var $body = $('.img-edit .panel-body');
    $body.slideDown(300, function(){
      if(!jcropInit){
        initJcrop();
      }
    });
    $body.prev('.panel-heading').removeClass('closed').addClass('open');
  });
  // Fechar o painel de edição
  $('.img-edit-cancel').click(function(){
    var $body = $('.img-edit .panel-body');
    $body.slideUp(300);
    $body.prev('.panel-heading').removeClass('open').addClass('closed');
    $('.toggle-lock input').prop('checked', false);
    jcrop_api.setOptions({aspectRatio: 0})
    jcrop_api.release();
    return false;
  });
});
