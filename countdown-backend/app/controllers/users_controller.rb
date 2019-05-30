class UsersController < ApplicationController
    def index 
        @users = User.all
        render json: @users
    end

    def create
        byebug
    end
end
