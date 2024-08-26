function App() {
    return (
        <div className='relative flex items-center justify-center min-h-screen'>
            <video
                autoPlay
                loop
                muted
                className='absolute inset-0 object-cover w-full h-full'>
                <source
                    src='https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr'
                    type='video/mp4'
                />
                Your browser does not support the video tag.
            </video>

            <div className='relative z-10 w-full max-w-md p-8 space-y-6  bg-opacity-90 bg-gray-900 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold text-center text-white'>
                    Tiger
                </h2>
                <form className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-white'>
                            Email
                        </label>
                        <input
                            type='email'
                            required
                            className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            placeholder='Email'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-white'>
                            Password
                        </label>
                        <input
                            type='password'
                            required
                            className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            placeholder='Password'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <input
                                id='remember-me'
                                type='checkbox'
                                className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                            />
                            <label
                                htmlFor='remember-me'
                                className='block ml-2 text-sm text-white'>
                                Remember me
                            </label>
                        </div>
                        <div className='text-sm'>
                            <a
                                href='#'
                                className='font-medium text-white hover:text-sky-500'>
                                Forgot your password?
                            </a>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'>
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
