<?php



//User routes==========================//
Route::get('new-user/{email}/{pw}/{with}', 'UserController@newUser');

Route::get('check-user/{email}/{pw}', 'UserController@checkUser');

Route::get('get-user/{userId}', 'UserController@getUser');

Route::get('plus-user/{name}/{id}/{gender}', 'UserController@plusUser');

Route::get('update-user/{id}/{name}/{email}/{password}', 'UserController@updateUser');

Route::get('delete-user/{userId}', 'UserController@deleteUser');

Route::get('forgot/{email}', 'UserController@forgotPassword');

Route::get('check-reset-token/{token}', 'UserController@checkResetToken');

Route::get('reset-pass/{userId}/{password}', 'UserController@resetPassword');

Route::get('restore-user/{email}/{pw}', 'UserController@restoreUser');






//Devices
Route::get('device/{userId}/{name}/{currentDeviceId}', 'UserController@device');

Route::get('get-devices/{userId}', 'UserController@getDevices');

Route::get('delete-device/{deviceId}', 'UserController@deleteDevice');




//Client routes==========================//
// Route::get('new-client', 'ClientController@newClient');

// Route::get('get-client', 'ClientController@getClient');

// Route::get('get-clients', 'ClientController@getClient');

// Route::get('update-client', 'ClientController@updateClient');

// Route::get('delete-client', 'ClientController@deleteClient');

// Route::get('reset-client-password', 'ClientController@resetClientPassword');




//Search routes===========================//
Route::get('search/{searchQuery}', 'SearchController@search');




//Playlist routes==========================//
Route::get('new-playlist/{userId}/{songId}/{playlistName}', 'PlaylistsController@newPlaylist');

Route::get('get-playlist-songs/{playlistId}', 'PlaylistsController@getPlaylistSongs');

Route::get('get-playlists/{userId}', 'PlaylistsController@getPlaylists');

Route::get('add-to-playlist/{songId}/{playlistId}', 'PlaylistsController@addToPlaylist');

Route::get('delete-from-playlist/{songId}/{playlistId}', 'PlaylistsController@deleteFromPlaylist');

Route::get('delete-playlist/{playlistId}', 'PlaylistsController@deletePlaylist');

// Route::get('share-playlist', 'PlaylistsController@sharePlaylist');




//Library routes============================//

Route::get('get-library/{id}/{sortBy}/{sortOrder}', 'LibraryController@getLibrary');

Route::get('add-to-library/{songId}/{userId}', 'LibraryController@addToLibrary');

Route::get('remove-from-library/{songId}/{userId}', 'LibraryController@removeFromLibrary');






//Ad routes===============================//
// Route::get('new-ad', 'AdsController@newAd');

// Route::get('get-ad', 'AdsController@getAd');

// Route::get('get-ads', 'AdsController@getAds');

// Route::get('update-ad', 'AdsController@updateAd');

// Route::get('delete-ad', 'AdsController@deleteAd');





















