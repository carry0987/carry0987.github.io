import { Cydia } from '@/lib/cydia';
import type { Route } from './+types/cydia';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'Cydia' }, { name: 'description', content: 'Cydia is a package manager for iOS' }];
}

export default function CydiaPage() {
    return <Cydia />;
}
