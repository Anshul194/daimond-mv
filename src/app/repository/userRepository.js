import User from "../models/User";
import CrudRepository from "./crud-repository";

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

   async count(filterConditions) {
  return await User.countDocuments(filterConditions);
}

async getALL(filterConditions, sortConditions, skip, limit) {
  return await User.find(filterConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .lean();
}


}

export default UserRepository;
