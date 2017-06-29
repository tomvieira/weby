class AddMaskXToRepositories < ActiveRecord::Migration
  def change
    add_column :repositories, :mask_x, :integer
    add_column :repositories, :mask_y, :integer
    add_column :repositories, :mask_width, :integer
    add_column :repositories, :mask_height, :integer
  end
end
