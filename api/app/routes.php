<?php


//Application Routes===================//


//http://localhost/controller/method/arguments


//User routes==========================//
Route::get('new-user', 'UserController@newUser');

Route::get('get-user', 'UserController@getUser');

Route::get('get-users', 'UserController@getUsers');

Route::get('update-user', 'UserController@updateUser');

Route::get('delete-user', 'UserController@deleteUser');

Route::get('reset-user-password', 'UserController@resetUserPassword');

//Devices
Route::get('new-device', 'UserController@newDevice');

Route::get('get-device', 'UserController@getDevice');

Route::get('get-devices', 'UserController@getDevices');

Route::get('delete-device', 'UserController@deleteDevice');




//Client routes==========================//
Route::get('new-client', 'ClientController@newClient');

Route::get('get-client', 'ClientController@getClient');

Route::get('get-clients', 'ClientController@getClient');

Route::get('update-client', 'ClientController@updateClient');

Route::get('delete-client', 'ClientController@deleteClient');

Route::get('reset-client-password', 'ClientController@resetClientPassword');




//Search routes===========================//
Route::get('search/{q}', 'SearchController@search');




//Playlist routes==========================//
Route::get('new-playlist', 'PlaylistsController@newPlaylist');

Route::get('get-playlist', 'PlaylistsController@getPlaylist');

Route::get('get-playlists', 'PlaylistsController@getPlaylists');

Route::get('update-playlist', 'PlaylistsController@updatePlaylist');

Route::get('delete-playlist', 'PlaylistsController@deletePlaylist');

Route::get('share-playlist', 'PlaylistsController@sharePlaylist');




//Library routes============================//
Route::get('new-library', 'LibraryController@newLibrary');

Route::get('get-library', 'LibraryController@getLibrary');

Route::get('update-library', 'LibraryController@updateLibrary');

Route::get('delete-library', 'LibraryController@deleteLibrary');




//Song routes==============================//
Route::get('get-song', 'SongController@getSong');

Route::get('update-song', 'SongController@updateSong');

Route::get('share-song', 'SongController@shareSong');




//Ad routes===============================//
Route::get('new-ad', 'AdsController@newAd');

Route::get('get-ad', 'AdsController@getAd');

Route::get('get-ads', 'AdsController@getAds');

Route::get('update-ad', 'AdsController@updateAd');

Route::get('delete-ad', 'AdsController@deleteAd');





















