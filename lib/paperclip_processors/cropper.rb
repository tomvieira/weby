module Paperclip
  class Cropper < Thumbnail
    def transformation_command
      if crop_command && ['original', 'o'].include?(options[:geometry])
        cmd = super
        cmd = cmd.join(' ') if cmd.is_a? Array
        crop_command + cmd.gsub(/ -crop \S+/, '').gsub(/\+repage/, '')
      else
        super
      end
    end

    def crop_command
      target = @attachment.instance
      if target.will_crop?
        "-crop #{target.crop_w.to_i}x#{target.crop_h.to_i}+#{target.crop_x.to_i}+#{target.crop_y.to_i} +repage "
      end
    end
  end
end
