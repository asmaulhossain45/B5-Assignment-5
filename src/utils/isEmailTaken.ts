import { User } from "../modules/user/user.model";
import { Agent } from "../modules/agent/agent.model";
import { Admin } from "../modules/admin/admin.model";

const isEmailTaken = async (rawEmail: string): Promise<boolean> => {
  const email = rawEmail.trim().toLowerCase();
  
  const user = await User.findOne({ email });
  if (user) return true;

  const agent = await Agent.findOne({ email });
  if (agent) return true;

  const admin = await Admin.findOne({ email });
  if (admin) return true;
  return false;
};

export default isEmailTaken;
