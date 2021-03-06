# coding: utf-8
module SitesHelper

  def include_facebook_script
    if @fb_included.blank?
      @fb_included = true
      "<div id=\"fb-root\"></div>"+
      "<script async defer crossorigin=\"anonymous\" src=\"https://connect.facebook.net/#{current_locale == 'pt-BR' ? 'pt_BR' : 'en_US'}/sdk.js#xfbml=1&version=v3.3\"></script>"
    else
      ""
    end.html_safe
  end


  def render_social_share type
    html = '<div class="social-buttons">'
    if current_site.send("#{type}_social_share_networks".to_sym).to_a.include?('twitter')
      html += '<a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>'
      html += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>"
    end
    if current_site.send("#{type}_social_share_networks".to_sym).to_a.include?('facebook')
      html += include_facebook_script
      html += '<div class="fb-like" data-href="" data-width="" data-layout="button_count" data-action="like" data-size="large" data-show-faces="true" data-share="true"></div>'
    end
    html += '</div>'
    html.html_safe
  end
end