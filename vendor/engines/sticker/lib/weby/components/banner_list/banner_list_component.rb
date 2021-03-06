class BannerListComponent < Component
  component_settings :category, :orientation, :timer, :show_title, :show_description,
                     :show_controls, :html_class

  validates :category, presence: true
  validates :html_class, format: { with: /\A[A-Za-z0-9_\-]*\z/ }

  alias_method :_timer, :timer
  def timer
    _timer.blank? ? '4' : _timer
  end

  def show_controls?
    show_controls.blank? ? false : show_controls == '1'
  end

  def show_title?
    show_title.blank? ? false :  show_title == '1'
  end

  def show_description?
    show_description.blank? ? false :  show_description == '1'
  end

  def show_descriptionarea?
    descriptionarea.blank? ? false :  descriptionarea == '1'
  end

  def default_alias
    category
  end
end
