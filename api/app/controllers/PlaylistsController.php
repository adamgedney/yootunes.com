<?php
header('Access-Control-Allow-Origin: *');
class PlaylistsController extends BaseController {


	public function newPlaylist($userId, $songId, $playlistName)
	{

		//Create a new playlist for user
		$newPlaylist = Playlists::insert(array(
			'name'=>$playlistName,
			'user_id'=>$userId
			));



		//Get inserted playlist to retrieve id
		$getPlaylistId = Playlists::
			where('name', '=', $playlistName)
			->where('user_id', '=', $userId)
			->get();

		//Store new playlist id
		$playlistId= $getPlaylistId[0]->id;




		//Insert new playlist song on playlist id
		$newplaylistSong = PlaylistSongs::insert(array(
			'playlist_id'=>$playlistId,
			'song_id'=>$songId));



		header('Access-Control-Allow-Origin: *');
		return Response::json($newplaylistSong);
	}














	public function getPlaylistSongs($playlistId)
	{
		//Get playlists on userId
		$playlist = Playlists::where('playlists.id', '=', $playlistId)
								->join('playlist_songs', 'playlists.id', '=', 'playlist_songs.playlist_id')
								->join('songs', 'songs.id', '=', 'playlist_songs.song_id')
								// ->orderBy('songs.youtube_title', 'ASC')
								->get();



		header('Access-Control-Allow-Origin: *');
		return Response::json($playlist);
	}










	public function getPlaylists($userId)
	{
		//Get playlists songs on userId
		$playlists = Playlists::where('user_id', '=', $userId)
								->get();



		header('Access-Control-Allow-Origin: *');
		return Response::json($playlists);
	}















	public function updatePlaylist()
	{
		return "Testing route";
	}




	public function deletePlaylist()
	{
		return "Testing route";
	}



	//Return URL to retrieve a playlist
	//Mark playlist as public w/ is_shared
	//Build URL w/ username and playlist id
	public function sharePlaylist()
	{
		return "Testing route";
	}




	//================//
	//Internal Methods//
	//================//

}