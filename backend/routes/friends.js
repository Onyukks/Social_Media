const router = require('express').Router()
const FriendRequest = require('../models/FriendRequest')
const Friendship = require('../models/Friendships')
const User = require('../models/user')
const {requireAuth} = require('../middleware/protectedRoute')

// router.use(requireAuth)

//Send Friend Request
router.post('/sendfriendrequest',async(req,res) => {
    const { requesterId, recipientId } = req.body;

    try {
        const existingRequest = await FriendRequest.findOne({ requester: requesterId, recipient: recipientId });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }

        const friendRequest = new FriendRequest({
            requester: requesterId,
            recipient: recipientId
        });

        await friendRequest.save();
        res.status(200).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get Friend Requests with Mutual Friends Count
router.get('/friendrequest/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const friendRequests = await FriendRequest.find({
            recipient: userId,
            status: 'pending'
        }).populate('requester', 'name username email profilePic');

        // Calculate mutual friends count for each requester
        const friendRequestsWithMutualFriends = await Promise.all(friendRequests.map(async (request) => {
            const requesterId = request.requester._id;

            // Get friends of the recipient (userId)
            const recipientFriendships = await Friendship.find({
                $or: [{ user1: userId }, { user2: userId }]
            });

            const recipientFriends = recipientFriendships.map(f =>
                f.user1.equals(userId) ? f.user2 : f.user1
            );

            // Get friends of the requester
            const requesterFriendships = await Friendship.find({
                $or: [{ user1: requesterId }, { user2: requesterId }]
            });

            const requesterFriends = requesterFriendships.map(f =>
                f.user1.equals(requesterId) ? f.user2 : f.user1
            );

            // Find mutual friends
            const mutualFriends = recipientFriends.filter(friendId =>
                requesterFriends.some(f => f.equals(friendId))
            );

            // Add mutual friends count to the request object
            return {
                ...request.toObject(),
                mutualFriendsCount: mutualFriends.length
            };
        }));

        res.status(200).json(friendRequestsWithMutualFriends);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

//Accept friend request
router.put('/acceptrequest', async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        const friendship = new Friendship({
            user1: friendRequest.requester,
            user2: friendRequest.recipient
        });

        await friendship.save();
        res.status(200).json({ message: 'Friend request accepted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

//Reject Friend Request
router.put('/rejectfriend',async (req, res) => {
    const { requestId } = req.body;

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();
        res.status(200).json({ message: 'Friend request rejected.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get User Friends with Mutual Friends Count
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch friendships for the user
        const friendships = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }]
        }).populate('user1 user2', 'name username email profilePic');

        // Get the user's friends
        const friends = friendships.map(friendship => {
            if (friendship.user1._id.toString() === userId) {
                return friendship.user2;
            } else {
                return friendship.user1;
            }
        });

        // Fetch the user's friendships to find mutual friends
        const userFriendships = await Friendship.find({
            $or: [{ user1: userId }, { user2: userId }]
        });

        const userFriends = userFriendships.map(f =>
            f.user1.equals(userId) ? f.user2 : f.user1
        );

        // Calculate mutual friends for each friend
        const friendsWithMutualCount = await Promise.all(friends.map(async (friend) => {
            const friendId = friend._id;

            // Fetch friendships for the friend
            const friendFriendships = await Friendship.find({
                $or: [{ user1: friendId }, { user2: friendId }]
            });

            const friendFriends = friendFriendships.map(f =>
                f.user1.equals(friendId) ? f.user2 : f.user1
            );

            // Find mutual friends
            const mutualFriends = userFriends.filter(friendOfUser =>
                friendFriends.some(f => f.equals(friendOfUser))
            );

            // Add mutual friends count to the friend object
            return {
                ...friend.toObject(),
                mutualFriendsCount: mutualFriends.length
            };
        }));

        res.status(200).json(friendsWithMutualCount);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});


module.exports = router