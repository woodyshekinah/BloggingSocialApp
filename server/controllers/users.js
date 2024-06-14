import User from '../models/user.js';

//READ
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((Id) => User.findById(Id))
        );
        const formattedFriends = friends.map(
        ({ id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
       
    
