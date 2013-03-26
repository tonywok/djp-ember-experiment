require 'sinatra'

class Djp < Sinatra::Base

  get '/' do
    File.read('index.html')
  end

end

