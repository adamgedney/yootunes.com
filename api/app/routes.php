<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


//User routes
Route::get('register', 'UserController@registerUser');

Route::get('get-user', 'UserController@getUser');

Route::get('get-users', 'UserController@getUsers');

Route::get('update-user', 'UserController@updateUser');

Route::get('delete-user', 'UserController@deleteUser');

Route::get('reset-user-password', 'UserController@resetUserPassword');


//http://localhost/controller/method/arguments
// Route::get('/', function()
// {

// });