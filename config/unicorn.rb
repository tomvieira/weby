# set path to application
app_path = File.expand_path(File.dirname(__FILE__) + '/..')
working_directory app_path

# Set unicorn options
worker_processes Integer(ENV["WEB_CONCURRENCY"] || 4)
preload_app true
timeout 60

# Set up socket location
listen (ENV['PORT'] || 3000), :backlog => 64

# Set the location of the unicorn pid file. This should match what we put in the
# unicorn init script later.
pid app_path + '/tmp/unicorn.pid'

# You should define your stderr and stdout here. If you don't, stderr defaults
# to /dev/null and you'll lose any error logging when in daemon mode.
stderr_path app_path + '/log/unicorn.log'
stdout_path app_path + '/log/unicorn.log'

before_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.establish_connection
end
