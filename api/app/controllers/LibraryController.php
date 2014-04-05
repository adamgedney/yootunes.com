<?php

class LibraryController extends BaseController {






	//add sorting parameters to URL for artist, album, song, and genre
	public function getLibrary($id)
	{

		$library = Library::where('user_id', '=', $id)
							->join('library_songs', 'library.id', '=', 'library_songs.library_id')
							->get(array('song_id'));




		header('Access-Control-Allow-Origin: *');
		return Response::json($library);
	}




	//Remove song
	public function updateLibrary()
	{
		return "Testing route";
	}




	public function deleteLibrary()
	{
		return "Testing route";
	}









	//================//
	//Internal Methods//
	//================//

}