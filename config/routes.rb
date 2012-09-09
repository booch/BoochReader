BoochReader::Application.routes.draw do
  get 'index' => 'home#index'
  root to: 'home#index'
end
