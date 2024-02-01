import React from 'react';
import Image from 'next/image';
import { formatPoints } from '@/utils';

import styles from './UserPoints.module.css';

interface UserPointsProps {
    points: number;
}

const UserPoints: React.FC<UserPointsProps> = ({ points }) => {

    return (
        <div className={styles.main}>
            <div className={styles.title}>
                You Earned
            </div>
            <div className={styles.container}>
                <Image src="/assets/icons/point-container-left.svg" alt="box" width={295} height={209} />
                <div className={styles.points}>
                    <span>+</span>{formatPoints(points)}
                    <Image src="/assets/icons/point-g.svg" alt="box" width={64} height={64} />
                </div>
                <Image src="/assets/icons/point-container-right.svg" alt="box" width={295} height={209} />
            </div>
        </div>
    );
};

export default UserPoints;
