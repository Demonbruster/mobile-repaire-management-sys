import { QueryClient } from "react-query";
import { reactQueryKey } from "../constants/constant";

const queryClient = new QueryClient()

queryClient.invalidateQueries({
  queryKey: Object.values(['MODELS']),
})

export default queryClient
