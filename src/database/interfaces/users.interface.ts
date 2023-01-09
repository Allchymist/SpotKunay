type Playlists = {
  name: string;
  url: string;
  createdAt: string;
};

export interface IUsers {
  _id: string;
  username: string;
  tag: string;
  avatar: string;
  playlists: Playlists[];
}