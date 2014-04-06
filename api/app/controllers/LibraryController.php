<?php
header('Access-Control-Allow-Origin: *');

class LibraryController extends BaseController {






	//add sorting parameters to URL for artist, album, song, and genre
	public function getLibrary($id)
	{

		$library = Library::where('user_id', '=', $id)
							->join('library_songs', 'library.id', '=', 'library_songs.library_id')
							->join('songs', 'songs.id', '=', 'library_songs.song_id')
							->get();




		header('Access-Control-Allow-Origin: *');
		return Response::json($library);
	}




	//Add song to library
	public function addToLibrary($songId, $userId)
	{

		//Fetch library id based on user id
		$libraryId = Library::where('user_id', '=', $userId)
		->get(array('id'));


		//Insert song id into user songs paired to library id
		$librarySongs = LibrarySongs::insert(array(
			'song_id'=>$songId,
			'library_id'=>$libraryId));




		header('Access-Control-Allow-Origin: *');
		return Response::json($librarySongs);
	}




	public function deleteLibrary()
	{
		return "Testing route";
	}









	//================//
	//Internal Methods//
	//================//

}