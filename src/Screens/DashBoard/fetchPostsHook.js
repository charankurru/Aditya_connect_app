import { useEffect, useState } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        let isMounted = true;
        // setLoading(true)
        GetPosts({ channelId: channelId, pageNumber: pageNumber, limit: 5 })
            .then(res => {
                console.log(res)
                if (isMounted) {
                    setPosts([...posts, ...res.data.result])
                    setHasMore(res.data.result.length > 0)
                    setLoading(false)
                }
            }).catch(e => {
                setError(true)
            })
        return () => isMounted = false;
    }, [pageNumber])
    return { loading, error, posts, hasMore }
}
