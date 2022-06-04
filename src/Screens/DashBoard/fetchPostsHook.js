import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { GetPosts } from '../../API/services';

export default function fetchPostsHook(pageNumber, channelId, categoryChecks, setPageNumber) {
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true)
    const [posts, setPosts] = useState([])
    const [filterPosts, setFilterPosts] = useState([])

    useEffect(() => {
        setTimeout(() => {
            if (hasMore) {
                getMore();
            }
        }, 100);
    }, [pageNumber]);

    const checkForNoFilter = () => {
        if (categoryChecks) {
            for (var key in categoryChecks) {
                if (categoryChecks[key]) {
                    return false
                }
            }
        }
        return true
    }

    const performFilteringPosts = (newPosts) => {
        if (checkForNoFilter()) {
            setFilterPosts([...filterPosts, ...newPosts]);
            return
        }
        let filteredPosts = newPosts.filter(post => categoryChecks[post.categoryId])
        if (hasMore && filteredPosts.length == 0) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
            return
        }
        setFilterPosts([...filterPosts, ...filteredPosts]);
    }


    const getPosts = async () => {
        try {
            if (pageNumber == 1) {
                setPosts([]);
                setFilterPosts([]);
            }
            const res = await GetPosts(
                { channelId: "1232", pageNumber: pageNumber, limit: 26 })
            setPosts([...posts, ...res.data.result])
            console.log(res.data.result)
            setHasMore(res.data.result.length > 0)
            if (!categoryChecks) {
                setFilterPosts([...filterPosts, ...res.data.result])
                return
            }
            performFilteringPosts(res.data.result)
        } catch (error) {
            console.log(error)
        }
    }

    const getMore = () => {
        setIsMoreLoading(true)
        setTimeout(async () => {
            await getPosts();
            setIsMoreLoading(false)
        }, 1000);
    }

    return { isMoreLoading, posts, filterPosts, hasMore, setFilterPosts }
}
