import { getUserById } from '../../../controllers/adminController.js';


export async function GET(request, context) {
  const { params } = await context;
  const { id } = params;
  return getUserById(id);
}

