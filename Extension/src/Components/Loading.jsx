import Skeleton from '@mui/material/Skeleton';

const BaseSkeleton = () => {
    return (
        <Skeleton
            variant="text"
            width={'100%'}
            height={30}
            sx={{
                bgcolor: 'grey.900',
                borderRadius: '10px',
            }}
            animation="wave"
        />
    )
}

const Loading = () => {
    return (
        <div className='loading-container'>            
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
        </div>
    )
}

export default Loading;