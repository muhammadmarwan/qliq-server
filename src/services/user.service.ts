import User from '../models/User';

interface UserTreeNode {
  _id: string;
  name: string;
  email: string;
  level: number;
  downlines: UserTreeNode[];
  commissionBalance?: number;

}

async function getDownlines(userId: string, maxLevel: number, currentLevel = 1): Promise<UserTreeNode[]> {
  if (currentLevel > maxLevel) return [];

  const downlineUsers = await User.find({ referrer: userId }).lean();

  const downlines: UserTreeNode[] = await Promise.all(
    downlineUsers.map(async (downline) => {
      const children = await getDownlines(downline._id.toString(), maxLevel, currentLevel + 1);
      return {
        _id: downline._id.toString(),
        name: downline.name,
        email: downline.email,
        level: downline.level,
        downlines: children,
        commissionBalance: downline.commissionBalance,
      };
    })
  );

  return downlines;
}

export async function getUserTree(maxLevel = 5): Promise<UserTreeNode[]> {
  const rootUsers = await User.find({ referrer: null }).lean();

  const tree: UserTreeNode[] = await Promise.all(
    rootUsers.map(async (user) => {
      const downlines = await getDownlines(user._id.toString(), maxLevel);
      
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        level: user.level,
        downlines,
      };
    })
  );

  return tree;
}

export async function getUserDetails(userId: string): Promise<any> {
  const user = await User.findById(userId).lean();
  return user;
} 

export async function getUserTreeByUserId(userId: string, maxLevel = 3): Promise<UserTreeNode | null> {
  const user = await User.findById(userId).lean();
  if (!user) return null;

  const downlines = await getDownlines(userId, maxLevel, 1);

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    level: user.level,
    downlines,
    commissionBalance: user.commissionBalance,
  };
}